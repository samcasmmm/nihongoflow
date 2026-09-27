import { NextRequest, NextResponse } from 'next/server';
import { ZodType } from 'zod';
import { getSession, SessionPayload } from '@/core/auth/session';
import { errorResponse, handleApiError } from '@/core/api-response';

export function apiHandler<TBody = unknown, TParams = Record<string, string | string[]>, TAuth extends boolean = false>(
  opts: {
    auth?: TAuth;
    schema?: ZodType<TBody>;
  },
  handler: (
    req: NextRequest,
    ctx: {
      session: TAuth extends true ? SessionPayload : SessionPayload | undefined;
      body: TBody;
      params: TParams;
    },
  ) => Promise<NextResponse>,
) {
  return async (req: NextRequest, rawCtx?: { params?: Promise<TParams> | TParams }) => {
    try {
      let session: SessionPayload | undefined;

      if (opts.auth) {
        const currentSession = await getSession();
        if (!currentSession) {
          return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
        }
        session = currentSession;
      }

      let body = undefined as unknown as TBody;
      if (opts.schema) {
        const rawJson: unknown = await req.json();
        body = opts.schema.parse(rawJson);
      }

      let resolvedParams = {} as TParams;
      if (rawCtx?.params) {
        resolvedParams =
          typeof (rawCtx.params as Promise<TParams>).then === 'function'
            ? await (rawCtx.params as Promise<TParams>)
            : (rawCtx.params as TParams);
      }

      return await handler(req, {
        session: session as TAuth extends true ? SessionPayload : SessionPayload | undefined,
        body,
        params: resolvedParams,
      });
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Convenient shorthand for authenticated routes without body schema
 */
export function withAuth<TParams = Record<string, string | string[]>>(
  handler: (
    req: NextRequest,
    ctx: {
      session: SessionPayload;
      body: unknown;
      params: TParams;
    },
  ) => Promise<NextResponse>,
) {
  return apiHandler({ auth: true }, handler);
}

import { Request as Req, Response as Res, NextFunction } from "express";
export interface RequestWithPayload extends Request {
  payload?: Record<string, any>;
}
export type Request = Req;
export type Response = Res;
export type ControllerType<T extends string> = {
  [key in T]: (req: Request, res: Response) => unknown;
};
export type MiddlewareType<
  T extends string,
  R = Request | RequestWithPayload
> = {
  [key in T]: (req: R, res: Response, next: NextFunction) => unknown;
};

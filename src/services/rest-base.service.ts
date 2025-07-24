/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {AxiosRequestConfig} from "axios";
import {CreateQueryParams, RequestQueryBuilder} from "nest-crud-client";
import {DeepPartial} from "../utils/deepPartial";

export type BuilderParams = RequestQueryBuilder | CreateQueryParams;
export class ApiException {
  status?: number;
  message?: string;
  data?: any;
  constructor(params: {status?: number; message: string; data?: any}) {
    this.message = params.message;
    this.data = params.data;
    this.status = params.status;
  }
}
export interface ApiErrorResponse {
  message: string;
  data: unknown;
}
interface IPagination<T> {
  data: T[];
  page: number;
  count: number;
  pageCount: number;
  total: number;
}
export class RestBaseService<T> {
  constructor(public apiUrl: string, public entity: string) {
    this.apiUrl = apiUrl;
    this.entity = entity;
  }

  static toBuilder(builder?: BuilderParams): RequestQueryBuilder {
    if (!builder) {
      return RequestQueryBuilder.create();
    } else if (!(builder instanceof RequestQueryBuilder)) {
      return RequestQueryBuilder.create(builder);
    }
    return builder;
  }

  getPagination(
    limit: number,
    page: number,
    pBuilder: BuilderParams
  ): Promise<IPagination<T>> {
    const builder = RestBaseService.toBuilder(pBuilder);
    builder.setLimit(limit);
    builder.setPage(page);
    return this.fetch(this.getBaseUrl(), {
      builder,
      method: "GET",
    });
  }
  getMany(builder?: BuilderParams): Promise<T[]> {
    return this.fetch(this.getBaseUrl(), {
      builder,
      method: "GET",
    });
  }

  getOne(value: number | string, builder?: BuilderParams) {
    const url = this.getOneUrl(value);
    return this.fetch<T>(url, {
      builder,
      method: "GET",
    });
  }

  create(body: DeepPartial<T>, builder?: BuilderParams) {
    let token;
    if (typeof Storage !== "undefined") {
      token = localStorage.getItem("token");
    }
    return this.fetch<DeepPartial<T>>(this.getBaseUrl(), {
      method: "POST",
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      builder,
    });
  }

  createMany(body: DeepPartial<T>[]) {
    return this.fetch<DeepPartial<T[]>>(this.getBaseUrl() + "/bulk", {
      method: "POST",
      data: JSON.stringify({bulk: body}),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  put(value: number | string, body: DeepPartial<T>) {
    const url = this.getOneUrl(value);
    return this.fetch<DeepPartial<T>>(url, {
      method: "PUT",
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  patch(value: number | string, body: DeepPartial<T>, builder?: BuilderParams) {
    const url = this.getOneUrl(value);
    return this.fetch<DeepPartial<T>>(url, {
      method: "PATCH",
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      builder,
    });
  }

  delete(value: number | string) {
    const url = this.getOneUrl(value);
    return this.fetch<void>(url, {method: "DELETE"});
  }

  getParamsFromQuery(builder?: BuilderParams) {
    if (!builder) return "";
    if (!(builder instanceof RequestQueryBuilder)) {
      builder = RequestQueryBuilder.create(builder);
    }
    return "?" + this.getQuery(builder);
  }

  /**
   * Get request link
   */
  getBaseUrl() {
    return `${this.apiUrl}/${this.entity}`;
  }

  getOneUrl(value: number | string) {
    return `${this.getBaseUrl()}/${value}`;
  }

  getQuery(builder: RequestQueryBuilder) {
    if (builder) {
      return builder.query();
    }
    return "";
  }

  async fetch<R = any>(
    url: string,
    options?: AxiosRequestConfig & {
      builder?: BuilderParams;
    }
  ) {
    if (options?.builder) {
      url += this.getParamsFromQuery(options.builder);
    }
    try {
      const response = await axios(url, {
        ...options,
      });
      return response.data as R;
    } catch (error: any) {
      throw new ApiException({
        message: error.message || "Lỗi",
        data: error.data,
      });
    }
  }
}

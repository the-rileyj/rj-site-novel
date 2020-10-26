import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

export const ApiURL = `http://rj-site-back-end/api`;

export interface ApiResponse<T> {
  err: boolean;
  data: T | null;
  msg: string;
  logout?: boolean;
}

const validateStatus = (statusCode: number): boolean =>
  statusCode <= 500 && statusCode !== 404;

export default class consumeApi {
  private static consumeCommon<D>(
    axiosMethod: <T = any, R = AxiosResponse<T>>(
      url: string,
      config?: AxiosRequestConfig
    ) => Promise<R>,
    path: string,
    config?: AxiosRequestConfig
  ): [Promise<ApiResponse<D>>, () => void] {
    const source = axios.CancelToken.source();

    return [
      new Promise(
        (
          resolve: (value: ApiResponse<D>) => void,
          reject: (reason: ApiResponse<D>) => void
        ) => {
          axiosMethod<ApiResponse<D>>(`${ApiURL}${path}`, {
            ...config,
            timeout: 8 * 1000,
            cancelToken: source.token,
            validateStatus: validateStatus,
          })
            .then(
              (response: AxiosResponse<ApiResponse<D>>) =>
                resolve(response.data),
              (errResponse: AxiosResponse<ApiResponse<D>>) =>
                reject(errResponse.data)
            )
            .catch((err: ApiResponse<D>) => {
              if (axios.isCancel(err)) return;

              reject({
                err: true,
                data: null,
                msg: err.msg,
                logout: err.logout,
              });
            });
        }
      ),
      () => source.cancel(),
    ];
  }

  private static consumeCommonData<D>(
    axiosMethod: <T = any, R = AxiosResponse<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ) => Promise<R>,
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): [Promise<ApiResponse<D>>, () => void] {
    const source = axios.CancelToken.source();

    return [
      new Promise(
        (
          resolve: (value: ApiResponse<D>) => void,
          reject: (reason: ApiResponse<D>) => void
        ) => {
          axiosMethod<ApiResponse<D>>(`${ApiURL}${path}`, data, {
            ...config,
            timeout: 8 * 1000,
            cancelToken: source.token,
            validateStatus: validateStatus,
          })
            .then(
              (response: AxiosResponse<ApiResponse<D>>) =>
                resolve(response.data),
              (errResponse: AxiosResponse<ApiResponse<D>>) =>
                reject(errResponse.data)
            )
            .catch((err: ApiResponse<D>) => {
              if (axios.isCancel(err)) return;

              reject({
                err: true,
                data: null,
                msg: err.msg,
                logout: err.logout,
              });
            });
        }
      ),
      () => source.cancel(),
    ];
  }

  private static getConfig(config?: AxiosRequestConfig, token?: string) {
    if (token !== undefined) {
      if (config === undefined) {
        return { headers: { Authorization: token } };
      }

      config.headers = {
        ...(config.headers ?? {}),
        Authorization: token,
      };
    }

    return config;
  }

  static get<T>(
    path: string,
    config?: AxiosRequestConfig,
    token?: string
  ): [Promise<ApiResponse<T>>, () => void] {
    return this.consumeCommon<T>(
      axios.get,
      path,
      this.getConfig(config, token)
    );
  }

  static post<T>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig,
    token?: string
  ): [Promise<ApiResponse<T>>, () => void] {
    return this.consumeCommonData<T>(
      axios.post,
      path,
      data,
      this.getConfig(config, token)
    );
  }

  //   static getLatestFeed(
  //     token: string,
  //     data?: any
  //   ): [Promise<ApiResponse<FeedResponse>>, () => void] {
  //     if (token !== "")
  //       return this.post<FeedResponse>(
  //         `/api/a/article/feed/latest?auth_token=${token}`,
  //         data
  //       );

  //     return this.post<FeedResponse>("/api/n/article/feed/latest", data);
  //   }

  //   static getHottestFeed(
  //     token: string,
  //     data?: any
  //   ): [Promise<ApiResponse<FeedResponse>>, () => void] {
  //     if (token !== "")
  //       return this.post<FeedResponse>(
  //         `/api/a/article/feed/hottest?auth_token=${token}`,
  //         data
  //       );

  //     return this.post<FeedResponse>("/api/n/article/feed/hottest", data);
  //   }

  //   static voteOnArticle(
  //     token: string,
  //     data: any
  //   ): [Promise<ApiResponse<ArticleVoteResponse>>, () => void] {
  //     return this.post<ArticleVoteResponse>(
  //       `/api/a/article/vote?auth_token=${token}`,
  //       data
  //     );
  //   }

  //   static logoutUser(token: string): [Promise<ApiResponse<{}>>, () => void] {
  //     return this.post<{}>(`/api/a/auth/logout?auth_token=${token}`);
  //   }

  //   static checkUserStatus(
  //     token: string
  //   ): [Promise<ApiResponse<CheckUserStatusResponse>>, () => void] {
  //     return this.post<CheckUserStatusResponse>(
  //       `/api/a/auth/status?auth_token=${encodeURIComponent(token)}`
  //     );
  //   }

  //   static checkArticleCache(
  //     data: any
  //   ): [Promise<ApiResponse<CheckArticleCacheResponse>>, () => void] {
  //     return this.post<CheckArticleCacheResponse>(`/api/n/bypass/check`, data);
  //   }

  //   static getArticleWithRelated(
  //     token: string,
  //     data?: any
  //   ): [Promise<ApiResponse<ArticleWithRelated>>, () => void] {
  //     if (token !== "")
  //       return this.post<ArticleWithRelated>(
  //         `/api/a/article/read/related?auth_token=${token}`,
  //         data
  //       );

  //     return this.post<ArticleWithRelated>(`/api/n/article/read/related`, data);
  //   }

  //   static getRelatedArticles(
  //     token: string,
  //     data?: any
  //   ): [Promise<ApiResponse<RelatedArticles>>, () => void] {
  //     if (token !== "")
  //       return this.post<RelatedArticles>(
  //         `/api/a/article/related?auth_token=${token}`,
  //         data
  //       );

  //     return this.post<RelatedArticles>(`/api/n/article/related`, data);
  //   }

  //   static searchArticles(
  //     token: string,
  //     data?: any
  //   ): [Promise<ApiResponse<SearchWithRelatedResults>>, () => void] {
  //     if (token !== "")
  //       return this.post<SearchWithRelatedResults>(
  //         `/api/a/article/search?auth_token=${token}`,
  //         data
  //       );

  //     return this.post<SearchWithRelatedResults>(`/api/n/article/search`, data);
  //   }
}

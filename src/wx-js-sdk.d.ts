declare namespace wx {
    /**
     * ready事件.config信息验证后会执行ready方法.
     * @param callback
     */
    export function ready(callback: (() => void)): void;

    /**
     * 错误事件监听.config信息验证失败会执行error函数，如签名过期导致验证失败.
     * @param callback
     */
    export function error(callback: ((res: Error) => void)): void;

    /**
     * 配置.
     * @param options
     */
    export function config(options: {}): void;
}

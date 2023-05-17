export const utils = {
  getArgsToLog(params: getArgsToLogInterface): string {
    const {args, logArgsLambda = _args => args, shouldLogArgs} = params;
    if (!shouldLogArgs) {
      return "args skipped";
    }
    try {
      return this._removePasswordFromLogs(logArgsLambda(args));
    } catch (err) {
      return `Failed to log args: ${err}`;
    }
  },

  _removePasswordFromLogs(args: unknown): string {
    return JSON.stringify(args, (key, value) =>
      key === "password" ? "***" : value,
    );
  },
};

export interface genericArgsToLogInterface {
  logArgsLambda?: (args) => Record<string, unknown>;
  shouldLogArgs?: boolean;
}

interface getArgsToLogInterface extends genericArgsToLogInterface {
  args: unknown[];
}

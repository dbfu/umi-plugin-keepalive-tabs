import type { IApi } from 'umi';
import * as fs from 'fs'
import * as path from 'path'

export default (api: IApi) => {
  // See https://umijs.org/docs/guides/plugins

  // 获取tpl文件夹下的所有文件路径
  const filePaths = fs.readdirSync(path.join(__dirname, './tpl/'));

  api.onGenerateFiles(() => {
    // 把tpl文件全部复制到项目临时文件中
    filePaths.forEach((filePath: string) => {
      api.writeTmpFile({
        path: `plugin-keepalive-tabs/${filePath.replace('tpl', 'tsx')}`,
        noPluginDir: true,
        content: fs.readFileSync(path.join(__dirname, `./tpl/${filePath}`)).toString(),
      })
    });

    api.writeTmpFile({
      content: `export { KeepAliveTabContext } from './context'`,
      path: `plugin-keepalive-tabs/index.tsx`,
      noPluginDir: true,
    });
  });

  // 注册layout
  api.register({
    key: 'addLayouts',
    fn() {
      return [{
        id: 'keepalive-tabs',
        file: path.join(api.paths.absTmpPath, './plugin-keepalive-tabs/layout.tsx'),
        test: (route: any) => {
          return route.layout !== false;
        },
      }];
    },
    stage: -1, // 这里给-1，想让我们写的layout注册到全局layout之前
  });
};

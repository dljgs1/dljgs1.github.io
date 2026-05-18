## Why

当前仓库已经完成“主站首页 + 独立子页面”的基础结构，但 `COAController.html` 仍然停留在根目录独立文件形态，未接入统一的子页面目录、首页卡片入口和共享视觉体系，导致页面风格、导航方式与主站其余页面不一致。

同时，该页面把 `GIST_ID` 写死在前端源码中，配置方式与 Token 的本地输入缓存机制不一致，也不利于后续切换不同 Gist 或在不同环境下复用页面。因此需要将该控制台页面按既有站点架构收编，并把 Gist 连接信息统一改为用户本地输入配置。

## What Changes

- 将根目录 `COAController.html` 迁移为主站下的独立子页面，使用现有目录式路由结构承载。
- 让 COA 控制台页面复用主站公共样式语言、返回首页入口和页面骨架，保持与现有作品集风格一致。
- 为主站首页补充 COA 控制台的卡片元信息，使其能够从首页被发现和进入。
- 将原本写死在页面脚本中的 `GIST_ID` 改为用户输入项，并像 Token 一样缓存到浏览器本地。
- 调整页面说明文案和配置区结构，使 Token 与 Gist ID 都被视为本地连接配置，而不是写回远端 Gist 的内容。

## Capabilities

### New Capabilities
- `coa-controller-page`: 定义 COA 控制台作为主站中的独立子页面存在，提供统一站点风格、首页入口，以及基于本地输入的 GitHub Token 与 Gist ID 连接配置。

### Modified Capabilities
- None.

## Impact

- Affected code:
  - `COAController.html`
  - `assets/js/site-data.js`
  - `assets/css/site.css`
  - 新增 `pages/coa-controller/index.html`
  - 可能新增页面专属脚本文件
- Affected systems:
  - 主站子页面导航与卡片入口
  - COA 控制台的页面结构与静态资源组织方式
  - Gist 连接配置的本地缓存逻辑
- Dependencies:
  - 继续使用浏览器 `localStorage`
  - 继续使用 GitHub Gist API
- APIs:
  - 无新增后端 API
- Breaking impact:
  - 原根目录 `COAController.html` 不再作为推荐入口，主入口迁移为主站子页面路径

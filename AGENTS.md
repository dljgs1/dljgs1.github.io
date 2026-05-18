# AGENTS.md

## 项目概览

这是一个纯静态网页项目，当前采用“主站首页 + 独立子页面”的结构。

- 主站首页负责统一展示项目入口和站点说明。
- 每个子页面都拥有自己的独立 URL。
- 公共样式、首页脚本、页面专属脚本和页面专属数据按目录拆分。
- 项目兼容 GitHub Pages 一类“目录即路由”的静态托管方式。

当前已经落地的示例子页面是 `你画我猜`：

- 首页入口：`/`
- 子页面入口：`/pages/draw-and-guess/`

## 当前目录结构

```text
githubio/
├─ index.html                         # 主站首页
├─ AGENTS.md                          # 本文件，说明架构与扩展方式
├─ img/
│  └─ code.jpg                        # 当前首页使用的二维码图片
├─ assets/
│  ├─ css/
│  │  └─ site.css                     # 主站和子页面共享样式
│  ├─ data/
│  │  └─ draw-and-guess.js            # 子页面专属数据示例
│  └─ js/
│     ├─ site-data.js                 # 首页卡片配置数据
│     ├─ site.js                      # 首页卡片渲染逻辑
│     └─ pages/
│        └─ draw-and-guess.js         # 子页面专属逻辑示例
├─ pages/
│  └─ draw-and-guess/
│     └─ index.html                   # 你画我猜独立页面
├─ openspec/
│  ├─ config.yaml
│  └─ changes/
│     └─ refactor-site-into-hub-and-subpages/
│        ├─ proposal.md
│        ├─ design.md
│        ├─ tasks.md
│        └─ specs/
└─ vendor/ dist/ js/                  # 历史资源目录，当前新页面不再依赖
```

## 架构说明

### 1. 首页层

首页文件是 `index.html`。

职责：

- 展示站点标题、简述和作品集风格的项目入口。
- 提供卡片容器 `#page-card-list`。
- 只负责聚合，不承载具体项目业务逻辑。

首页的项目卡片不是硬编码在 HTML 中，而是由如下链路生成：

1. `assets/js/site-data.js` 提供 `window.SITE_PAGES`
2. `assets/js/site.js` 读取 `SITE_PAGES`
3. `site.js` 按 `order` 排序后渲染卡片到 `#page-card-list`

这意味着：

- 新增子页面时，首页通常不需要手写新卡片 HTML。
- 只需要补充页面配置数据即可让首页自动展示入口。

### 2. 子页面层

每个子页面都位于 `pages/<slug>/index.html`。

示例：

- `pages/draw-and-guess/index.html`

这样做的好处：

- 页面 URL 稳定，天然适合静态托管。
- 每个页面可以独立访问、独立分享。
- 后续增加页面时命名和结构保持一致。

### 3. 公共资源层

公共资源目前集中在 `assets/` 下：

- `assets/css/site.css`
  - 提供首页和子页面共享的布局、卡片、按钮、面包屑、作品集风格样式。
- `assets/js/site.js`
  - 只处理首页卡片渲染，不应混入具体子页面业务逻辑。
- `assets/js/site-data.js`
  - 维护首页卡片元信息，是新增页面时最常修改的文件之一。

原则：

- 公共样式放 `assets/css/`
- 首页聚合逻辑放 `assets/js/`
- 页面专属逻辑放 `assets/js/pages/`
- 页面专属数据放 `assets/data/`

### 4. 页面专属逻辑层

页面专属逻辑和数据按页面拆开。

以 `你画我猜` 为例：

- 页面结构：`pages/draw-and-guess/index.html`
- 页面逻辑：`assets/js/pages/draw-and-guess.js`
- 页面数据：`assets/data/draw-and-guess.js`

这种拆法的价值是：

- 首页不会加载无关的游戏脚本和词库数据。
- 页面修改范围清晰，不容易影响其他页面。
- 同类互动页可以复制这一套模式快速扩展。

## 后续扩充子页面的方法

新增一个子页面时，推荐按照下面的最小步骤进行。

### 步骤 1：确定页面 slug

先确定页面目录名，使用简洁的 kebab-case。

示例：

- `about-me`
- `pixel-playground`
- `daily-tools`

最终页面路径会是：

```text
pages/<slug>/index.html
```

对应访问路径通常是：

```text
/pages/<slug>/
```

### 步骤 2：创建子页面目录和入口文件

在 `pages/` 下新增目录，并创建 `index.html`。

建议直接参考现有页面：

- `pages/draw-and-guess/index.html`

新页面至少应包含：

- 页面标题
- 返回首页的入口
- 页面主体区域
- 对应公共样式引用
- 页面专属脚本引用（如果需要）

### 步骤 3：决定是否需要页面专属脚本

如果新页面只有静态内容：

- 只写 `pages/<slug>/index.html` 即可

如果新页面有交互逻辑：

- 新建 `assets/js/pages/<slug>.js`

如果新页面还有独立数据源：

- 新建 `assets/data/<slug>.js`

推荐保持一一对应关系：

```text
pages/<slug>/index.html
assets/js/pages/<slug>.js
assets/data/<slug>.js
```

### 步骤 4：把页面加入首页卡片配置

编辑 `assets/js/site-data.js`，在 `window.SITE_PAGES` 中新增一项。

建议字段保持一致：

```js
{
    slug: "page-slug",
    title: "页面标题",
    description: "一句话描述这个页面做什么。",
    href: "pages/page-slug/",
    status: "Project 02",
    order: 2
}
```

说明：

- `slug`：页面标识
- `title`：首页卡片标题
- `description`：首页卡片描述
- `href`：页面链接
- `status`：卡片角标文案，可作为项目编号或分类
- `order`：首页展示顺序，数字越小越靠前

### 步骤 5：验证首页渲染和独立访问

新增页面后，至少验证以下两点：

- 首页是否出现新卡片，且顺序正确
- 直接访问 `/pages/<slug>/` 是否正常打开

如果页面存在交互逻辑，还要额外验证：

- 页面专属 JS 是否正确加载
- 页面专属数据是否正确加载
- 返回首页链接是否可用

## 后续拓展开发建议

### 1. 新功能优先做成独立子页面

不要再把新功能直接堆到首页。

推荐做法：

- 首页只作为目录页
- 新功能、新项目、新实验都拆到 `pages/` 下

这样可以保持首页简洁，也能降低页面之间的耦合。

### 2. 不要把页面专属逻辑塞进 `site.js`

`site.js` 只应该做首页聚合相关的事情，例如：

- 读取卡片配置
- 排序
- 渲染卡片

不要把具体业务逻辑写进这里，例如：

- 游戏规则
- 表单交互
- 工具页业务逻辑

这些都应进入 `assets/js/pages/<slug>.js`。

### 3. 不要让首页依赖页面专属数据

例如 `你画我猜` 的词库已经被拆到：

- `assets/data/draw-and-guess.js`

后续新增页面时也应遵守同样原则：

- 页面自己的数据由页面自己加载
- 首页不加载页面专属数据

### 4. 优先复用公共样式，谨慎扩张全局样式

`assets/css/site.css` 目前承担的是站点公共外观。

新增页面时：

- 能复用现有类就优先复用
- 如果是页面私有样式，优先加页面范围内的 class
- 避免为了单页需求把全局样式改得过重

如果后续页面越来越多，可以考虑拆成：

```text
assets/css/site.css
assets/css/pages/<slug>.css
```

当前项目体量还不大，暂时不强制拆分。

### 5. 尽量保持静态部署友好

当前项目默认面向静态托管。

所以后续开发时，尽量遵守：

- 使用相对路径引用资源
- 使用目录式页面结构
- 不引入必须依赖构建工具的复杂方案

如果未来确实需要引入构建工具，应先在 OpenSpec 中补设计说明，而不是直接重构。

## 开发约束与建议

### 推荐修改入口

根据改动目标，优先查看这些文件：

- 改首页布局：`index.html`
- 改首页卡片数据：`assets/js/site-data.js`
- 改首页渲染：`assets/js/site.js`
- 改公共视觉：`assets/css/site.css`
- 改某个子页面：`pages/<slug>/index.html`
- 改某个子页面逻辑：`assets/js/pages/<slug>.js`
- 改某个子页面数据：`assets/data/<slug>.js`

### 历史目录说明

这些目录属于历史遗留资源：

- `vendor/`
- `dist/`
- `js/`

当前新版主站和新版子页面已经不再依赖它们。

后续开发建议：

- 新页面不要继续建立在这些旧目录之上
- 如非必要，不要再向其中追加新业务代码
- 如果后续确认完全无引用，可以再单独规划一次清理

### OpenSpec 工作流

项目已经建立了本次重构的 OpenSpec 记录，位于：

- `openspec/changes/refactor-site-into-hub-and-subpages/`

如果后续有较大结构变更，建议继续沿用 OpenSpec：

1. 先写 proposal
2. 再写 design
3. 再写 specs
4. 最后写 tasks 并实施

适用场景：

- 增加新的页面体系
- 调整主站信息架构
- 引入新的资源组织方式
- 清理旧目录和旧依赖

## 推荐的新增页面模板思路

如果只是快速新增一个页面，可以按下面的模式开始：

```text
pages/new-page/index.html
assets/js/pages/new-page.js
assets/data/new-page.js
```

然后：

1. 在 `index.html` 中引用 `../../assets/css/site.css`
2. 如有需要，再引用对应 JS 和 data 文件
3. 在 `assets/js/site-data.js` 增加首页卡片配置
4. 验证首页入口和独立 URL

## 最后约定

后续维护本项目时，优先遵守以下三条：

1. 首页只做聚合，不做具体业务。
2. 每个功能页都应尽量拥有独立目录、独立脚本、独立数据。
3. 新增页面时，优先走“建页面目录 + 配卡片数据”的扩展路径。

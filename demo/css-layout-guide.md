# CSS布局完全指南

CSS布局是前端开发的核心技能之一。本文将详细介绍各种CSS布局方法。

## 布局发展历史

CSS布局经历了几个重要阶段：

1. **Table布局**（1990s）- 使用表格进行布局
2. **Float布局**（2000s）- 使用浮动实现多列布局  
3. **Flexbox布局**（2010s）- 一维布局解决方案
4. **Grid布局**（2017+）- 二维布局解决方案

## Flexbox 布局

### 基本概念
Flexbox（弹性盒子）是一维布局方法，适合处理行或列的布局。

```css
.container {
    display: flex;
    /* 主轴方向 */
    flex-direction: row | row-reverse | column | column-reverse;
    
    /* 主轴对齐 */
    justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
    
    /* 交叉轴对齐 */
    align-items: stretch | flex-start | flex-end | center | baseline;
    
    /* 换行 */
    flex-wrap: nowrap | wrap | wrap-reverse;
}
```

### 子元素属性
```css
.item {
    /* 放大比例 */
    flex-grow: 0;
    
    /* 缩小比例 */  
    flex-shrink: 1;
    
    /* 基础大小 */
    flex-basis: auto;
    
    /* 简写 */
    flex: 1; /* 等同于 flex: 1 1 0%; */
    
    /* 单独对齐 */
    align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

### 常见布局模式

#### 水平居中
```css
.center-horizontal {
    display: flex;
    justify-content: center;
}
```

#### 垂直居中
```css
.center-vertical {
    display: flex;
    align-items: center;
    min-height: 100vh;
}
```

#### 完全居中
```css
.center-both {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
```

## Grid 布局

### 基本概念
CSS Grid 是二维布局系统，可以同时处理行和列。

```css
.grid-container {
    display: grid;
    
    /* 定义列 */
    grid-template-columns: 1fr 2fr 1fr;
    /* 或者 */
    grid-template-columns: repeat(3, 1fr);
    /* 或者 */
    grid-template-columns: 200px minmax(300px, 1fr) 100px;
    
    /* 定义行 */
    grid-template-rows: 100px auto 50px;
    
    /* 间距 */
    gap: 20px;
    /* 或者分别设置 */
    row-gap: 20px;
    column-gap: 10px;
}
```

### 子元素定位
```css
.grid-item {
    /* 指定位置 */
    grid-column: 1 / 3; /* 从第1列到第3列 */
    grid-row: 2 / 4;    /* 从第2行到第4行 */
    
    /* 或者使用简写 */
    grid-area: 2 / 1 / 4 / 3; /* row-start / col-start / row-end / col-end */
}
```

### 命名网格线
```css
.grid-container {
    grid-template-columns: [start] 1fr [middle] 1fr [end];
    grid-template-rows: [header-start] 100px [header-end main-start] 1fr [main-end footer-start] 50px [footer-end];
}

.header {
    grid-column: start / end;
    grid-row: header-start / header-end;
}
```

### 网格区域
```css
.grid-container {
    display: grid;
    grid-template-areas: 
        "header header header"
        "sidebar main main"
        "footer footer footer";
    grid-template-columns: 200px 1fr 1fr;
    grid-template-rows: 80px 1fr 60px;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

## 响应式布局

### 媒体查询
```css
/* 移动端优先 */
.container {
    padding: 16px;
}

/* 平板 */
@media (min-width: 768px) {
    .container {
        padding: 24px;
        max-width: 750px;
        margin: 0 auto;
    }
}

/* 桌面端 */
@media (min-width: 1024px) {
    .container {
        padding: 32px;
        max-width: 1200px;
    }
}
```

### 响应式Grid
```css
.responsive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}
```

### 容器查询（现代特性）
```css
.card-container {
    container-type: inline-size;
}

@container (min-width: 400px) {
    .card {
        display: flex;
        flex-direction: row;
    }
}
```

## 布局选择指南

### 何时使用Flexbox
- 一维布局（行或列）
- 导航栏
- 居中对齐
- 等高列
- 小型组件内部布局

### 何时使用Grid
- 二维布局（行和列）
- 页面整体布局
- 复杂的网格系统
- 重叠元素
- 不规则布局

### 何时使用Float
- 文字环绕图片
- 兼容老旧浏览器（不推荐新项目使用）

## 现代布局技巧

### Sticky布局
```css
.sticky-header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 100;
}
```

### 子网格（Subgrid）
```css
.parent-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

.child-grid {
    display: grid;
    grid-column: 2 / 5;
    grid-template-columns: subgrid; /* 继承父网格的列 */
}
```

### 宽高比（Aspect Ratio）
```css
.video-container {
    aspect-ratio: 16 / 9; /* 16:9 宽高比 */
}
```

## 调试技巧

### Firefox Grid 检查器
在Firefox开发者工具中可以可视化Grid布局。

### Chrome Flexbox 检查器  
Chrome开发者工具提供Flexbox可视化工具。

### CSS调试代码
```css
* {
    outline: 1px solid red; /* 显示所有元素边界 */
}

.debug-grid {
    background: 
        repeating-linear-gradient(
            0deg,
            transparent,
            transparent 19px,
            rgba(255,0,0,0.1) 20px
        ),
        repeating-linear-gradient(
            90deg,
            transparent,
            transparent 19px,
            rgba(255,0,0,0.1) 20px
        );
}
```

## 性能考虑

1. **避免深层嵌套**：过多嵌套会影响渲染性能
2. **合理使用Grid**：复杂Grid可能比Flexbox慢
3. **避免Layout Thrashing**：频繁改变布局属性会导致重排
4. **使用transform代替position**：transform不会触发重排

## 总结

现代CSS布局为我们提供了强大而灵活的工具。选择合适的布局方法，结合响应式设计，可以创建出优秀的用户界面。

**关键要点：**
- Flexbox适合一维布局
- Grid适合二维布局  
- 响应式设计必不可少
- 性能和可维护性同样重要

掌握这些布局技术，你就能应对绝大多数前端布局需求！

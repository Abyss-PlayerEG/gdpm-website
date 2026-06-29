# 触屏滚动优化

## 目标

优化移动端触屏滚动体验，同时兼顾电脑触控板。

## 问题分析

| 问题 | 平台 | 说明 |
|------|------|------|
| 橡皮筋效果 | iOS | 滚动到底部后继续拉会回弹 |
| 滚动惯性 | iOS/Android | 快速滑动可能跳过多个 section |
| 横向误触 | 移动端 | 手指不垂直滑动导致横向偏移 |
| 吸附延迟 | 移动端 | CSS scroll-snap 在触屏上响应慢 |
| 触控板灵敏度 | macOS/Windows | 触控板滚动速度和触屏不同 |

## 方案

### 1. 防止 iOS 橡皮筋

```css
html, body {
  overflow: hidden;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
}
```

### 2. 触摸事件拦截

```typescript
// 监听 touchstart/touchmove/touchend
// 计算滑动方向和距离
// 达到阈值时触发 section 切换
```

- 记录 `touchstart` Y 坐标
- 计算 `touchmove` 滑动距离
- 超过阈值（如 50px）时触发滚动
- 锁定滚动，防止重复触发

### 3. 滚动锁定

- 吸附动画期间禁用触摸事件
- 动画完成后解锁
- 防止快速连续滑动跳过 section

### 4. 触控板兼容

- 触控板触发 `wheel` 事件，不触发 `touch` 事件
- 现有 CSS `scroll-snap` 已支持触控板
- 无需额外处理

### 5. 防抖优化

- `touchmove` 事件加防抖
- 避免频繁触发滚动计算

## 实现计划

1. 创建 `useTouchScroll` composable
2. 在 `FullPageScroll` 中集成触摸事件
3. 添加滚动锁定机制
4. 测试 iOS Safari / Android Chrome / macOS 触控板

## 验收标准

- [ ] iOS Safari 橡皮筋效果消失
- [ ] 快速滑动不会跳过 section
- [ ] 横向误触不触发滚动
- [ ] 触控板滚动正常
- [ ] 吸附动画期间不可重复触发

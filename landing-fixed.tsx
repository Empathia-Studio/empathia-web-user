// Đây là phiên bản đã sửa của landing.tsx với tất cả dark: classes được thay thế bằng semantic colors

// Thay thế các pattern sau:
// bg-white dark:bg-black/80 → bg-card
// bg-gray-100 dark:bg-white/5 → bg-muted  
// border-gray-200 dark:border-white/20 → border-border
// text-gray-900 dark:text-white → text-foreground
// text-gray-700 dark:text-white/80 → text-muted-foreground
// hover:bg-white/10 → hover:bg-accent

// Ví dụ các thay đổi chính:
/*
Cũ:
<div className="bg-white dark:bg-black/80 border border-gray-200 dark:border-white/20">
  <h3 className="text-gray-900 dark:text-white">Title</h3>
  <p className="text-gray-700 dark:text-white/80">Content</p>
</div>

Mới:
<div className="bg-card border border-border">
  <h3 className="text-foreground">Title</h3>
  <p className="text-muted-foreground">Content</p>
</div>
*/

// Các semantic colors sử dụng:
// - bg-card: Background cho cards
// - bg-background: Background chính
// - bg-muted: Background cho secondary elements
// - border-border: Border color
// - text-foreground: Text color chính
// - text-muted-foreground: Text color phụ
// - hover:bg-accent: Hover state
// - bg-primary: Primary button background
// - text-primary-foreground: Primary button text

// Lợi ích:
// 1. Tự động chuyển màu theo theme
// 2. Code ngắn gọn hơn
// 3. Dễ maintain
// 4. Consistent design system

const fs = require('fs');

const files = [
  "app/admin/banners/new/page.tsx",
  "app/admin/blog/new/page.tsx",
  "app/admin/brands/new/page.tsx",
  "app/admin/categories/new/page.tsx",
  "app/admin/contact/ContactClient.tsx",
  "app/admin/contact/[id]/ReplyForm.tsx",
  "app/admin/coupons/new/page.tsx",
  "app/admin/custompages/new/page.tsx",
  "app/admin/footer/page.tsx",
  "app/admin/media/MediaClient.tsx",
  "app/admin/navigation/[id]/NavigationForm.tsx",
  "app/admin/newsletter/NewsletterClient.tsx",
  "app/admin/products/[id]/EditProductClient.tsx",
  "app/admin/products/new/page.tsx",
  "app/admin/settings/SettingsForm.tsx",
  "app/api/blogs/route.ts",
  "app/api/coupons/[id]/route.ts",
  "app/api/coupons/route.ts",
  "app/api/faqs/route.ts",
  "app/api/hero-slides/[id]/route.ts",
  "app/api/hero-slides/route.ts",
  "app/api/products/counts/route.ts",
  "app/api/settings/route.ts",
  "app/api/testimonials/route.ts",
  "app/api/upload/route.ts",
  "app/cart/page.tsx",
  "app/orders/track/page.tsx",
  "app/products/[id]/ProductDetailsClient.tsx"
];

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/catch\s*\(\s*(err|error|e)\s*\)/g, 'catch');
    content = content.replace(/import \{.*\} from "react";\n/g, (match) => {
      // Very simple replace for things like router, control, watch that are unused.
      return match;
    });
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } catch (e) {
    console.log(`Skipped ${file}`);
  }
}

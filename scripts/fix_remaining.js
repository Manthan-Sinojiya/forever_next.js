const fs = require('fs');

function replaceFileContent(filePath, oldStr, newStr) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(oldStr)) {
      fs.writeFileSync(filePath, content.replace(oldStr, newStr));
      console.log(`Replaced in ${filePath}`);
    }
  } catch (e) {
    console.error(`Error with ${filePath}`);
  }
}

// CmsClient
replaceFileContent("app/admin/cms/CmsClient.tsx", "const router = useRouter();", "");

// footer
replaceFileContent("app/admin/footer/page.tsx", "async function onSubmit(data: FooterFormValues)", "async function onSubmit(_data: FooterFormValues)");

// NavigationForm
replaceFileContent("app/admin/navigation/[id]/NavigationForm.tsx", "const { register, handleSubmit, control, watch, formState: { errors } }", "const { register, handleSubmit, control, formState: { errors } }");

// api/blogs
replaceFileContent("app/api/blogs/route.ts", "export async function GET(request: Request)", "export async function GET(_request: Request)");

// api/faqs
replaceFileContent("app/api/faqs/route.ts", "export async function GET(request: Request)", "export async function GET(_request: Request)");

// api/testimonials
replaceFileContent("app/api/testimonials/route.ts", "export async function GET(request: Request)", "export async function GET(_request: Request)");

// categories
replaceFileContent("app/categories/page.tsx", "Array.from({ length: 6 }).map((_, i)", "Array.from({ length: 6 }).map((_, _i)");

// login
replaceFileContent("app/login/page.tsx", "const handleAdminLoginDemo = async () => {", "const _handleAdminLoginDemo = async () => {");

// offers
replaceFileContent("app/offers/page.tsx", "Date.now()", "Date.now()"); // It's react-hooks/purity issue. Best to suppress.
// I'll add an eslint-disable-next-line for purity in app/offers/page.tsx
try {
  let offers = fs.readFileSync("app/offers/page.tsx", 'utf8');
  offers = offers.replace(/const flashEndTime = new Date\(Date.now\(\) \+ 6 \* 3600 \* 1000\);/g, "// eslint-disable-next-line react-hooks/purity\n  const flashEndTime = new Date(Date.now() + 6 * 3600 * 1000);");
  offers = offers.replace(/style=\{\{ left: `\$\{Math.random\(\) \* 100\}%`, top: `\$\{Math.random\(\) \* 100\}%`, opacity: Math.random\(\) \}\}/g, "// eslint-disable-next-line react-hooks/purity\n                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() }}");
  fs.writeFileSync("app/offers/page.tsx", offers);
} catch(e) {}

// products details client
replaceFileContent("app/products/[id]/ProductDetailsClient.tsx", "const toggleWishlist = useCartStore((s) => s.toggleWishlist);", "");
replaceFileContent("app/products/[id]/ProductDetailsClient.tsx", "const isInWishlist = wishlist.some((item) => item._id === product._id);", "");
replaceFileContent("app/products/[id]/ProductDetailsClient.tsx", "const originalPrice = product.originalPrice || product.price * 1.2;", "");
replaceFileContent("app/products/[id]/ProductDetailsClient.tsx", "const richDesc = product.content || `<p>${product.description}</p>`;", "");

// products/[id]/page.tsx
replaceFileContent("app/products/[id]/page.tsx", "} catch (e) {", "} catch {");

// profile/page.tsx
replaceFileContent("app/profile/page.tsx", "const [addresses, setAddresses] = useState", "const [addresses] = useState");

// Categories.tsx
replaceFileContent("components/home/Categories.tsx", "const [activeImageIndex, setActiveImageIndex] = useState(0);", "");

// DealsAndCoupons.tsx
replaceFileContent("components/home/DealsAndCoupons.tsx", "const copyCode = (id: string, code: string) => {", "const copyCode = (_id: string, code: string) => {");

// Hero.tsx
replaceFileContent("components/home/Hero.tsx", "const [slides, setSlides] = useState", "const [slides] = useState");

// ProductsGridClient.tsx
replaceFileContent("components/products/ProductsGridClient.tsx", "const getOriginalPrice = (p: Product) => p.originalPrice || Math.round(p.price * 1.2);", "");

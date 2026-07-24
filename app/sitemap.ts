import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://foreverhealthcare.in";

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/wellness`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    // Dynamic Products
    const productsRes = await fetch(`${baseUrl}/api/products?all=true`, { cache: 'no-store' });
    const productsData = await productsRes.json();
    if (productsData?.success && productsData?.data) {
      const productRoutes = productsData.data.map((product: any) => ({
        url: `${baseUrl}/products/${product._id}`,
        lastModified: new Date(product.updatedAt || Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
      routes.push(...productRoutes);
    }

    // Dynamic Categories
    const categoriesRes = await fetch(`${baseUrl}/api/categories`, { cache: 'no-store' });
    const categoriesData = await categoriesRes.json();
    if (categoriesData?.success && categoriesData?.data) {
      const categoryRoutes = categoriesData.data.map((cat: any) => ({
        url: `${baseUrl}/categories/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
      routes.push(...categoryRoutes);
    }
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
  }

  return routes;
}

import type { MetadataRoute } from "next";
import { firm } from "@/lib/content";
import { services } from "@/lib/services";
import { allPosts } from "@/lib/insights";
import { roles } from "@/lib/careers";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = allPosts();

  return [
    {
      url: firm.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...services.map((service) => ({
      url: `${firm.url}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      // The index changes whenever a post is added, which is the point of it.
      url: `${firm.url}/insights`,
      lastModified: posts[0] ? new Date(posts[0].date) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${firm.url}/careers`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    ...roles.map((role) => ({
      url: `${firm.url}/careers/${role.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...posts.map((post) => ({
      url: `${firm.url}/insights/${post.slug}`,
      // The post's own date, not the build's — a crawler should not be told
      // every article changed because the site was redeployed.
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}

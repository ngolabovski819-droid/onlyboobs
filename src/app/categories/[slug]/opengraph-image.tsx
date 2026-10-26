import { makeOg } from "@/lib/og";
import { getCategoryBySlug } from "@/config/categories";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return makeOg(
    `${getCategoryBySlug(slug)?.label ?? "Discover"} OnlyFans Creators`,
  );
}

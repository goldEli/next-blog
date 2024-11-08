import { useTranslation } from "@/app/i18n";

export const generateMetadata = () => {
  return {
    title: "博客列表",
    description: "这是博客列表页面",
    openGraph: {
      title: "博客列表",
      description: "这是博客列表页面",
    },
  };
};

export default async function Posts({ params }: { params: { lng: string } }) {
  const { t } = await useTranslation(params.lng)
  return (
    <div className="text-2xl font-bold">
      <h1>{params.lng}</h1>
      {t('blogList')}
    </div>
  );
}

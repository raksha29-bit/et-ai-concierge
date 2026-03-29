import FinanceNavigator from "@/components/FinanceNavigator";

export const metadata = {
  title: "Finance Navigator - Concierge",
  description: "Personalized financial suggestions and insights",
};

export default function NavigatorPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 pb-24">
      <FinanceNavigator />
    </div>
  );
}

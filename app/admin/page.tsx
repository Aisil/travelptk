import { MapPin, Users, CheckCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Всего локаций", value: "124", icon: MapPin, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Ожидают проверки", value: "12", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Опубликовано", value: "112", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Пользователи", value: "8", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, i: number) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-lg ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Последние заявки</h2>
        <div className="text-center py-10 text-gray-500">
          <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
          <p>Пока нет новых заявок</p>
        </div>
      </div>
    </div>
  );
}

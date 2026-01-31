import Image from 'next/image';

/**
 * WorkPlace 앱 로고
 */
export function AppLogo() {
  return (
    <div className="flex flex-col items-center gap-6 mb-12">
      {/* App Icon */}
      <div className="w-24 h-20 rounded-[20px] flex items-center justify-center shadow-lg">
        <div className="relative">
          <Image src="/hirekit/icon-large.png" alt="HireKit" width={72} height={72} />
        </div>
      </div>

      {/* App Title */}
      <h1 className="text-4xl font-bold text-white">HireKit</h1>
    </div>
  );
}

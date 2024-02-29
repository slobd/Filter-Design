function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Tab = ({ items, active, onClick, gap = 8 }) => {
  const gaps = {
    0: "space-x-0",
    1: "space-x-1",
    2: "space-x-2",
    3: "space-x-3",
    4: "space-x-4",
    5: "space-x-5",
    6: "space-x-6",
    7: "space-x-7",
    8: "space-x-8",
    9: "space-x-9",
    10: "space-x-10",
    11: "space-x-11",
    12: "space-x-12",
  };

  return (
    <div className="h-full">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          defaultValue={items.find((tab) => tab.id === active)}
        >
          {items.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="h-full hidden sm:block">
        <div className="h-full">
          <nav className={`h-full -mb-px flex ${gaps[gap]}`} aria-label="Tabs">
            {items.map((tab) => (
              <a
                key={tab.name}
                onClick={() => onClick(tab)}
                className={classNames(
                  tab.id === active
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "flex items-center whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer"
                )}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Tab;

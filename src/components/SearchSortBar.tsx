import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const SearchSortBar = ({
  search,
  onSearch,
  sort,
  onSort,
}: {
  search: string;
  onSearch: (v: string) => void;
  sort: "title" | "price";
  onSort: (k: "title" | "price") => void;
}) => (
  <div className="flex gap-4 items-center my-6">
    <Input
      placeholder="Search by name..."
      value={search}
      onChange={e => onSearch(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onSearch('')}
      className="max-w-sm"
    />
    <Select value={sort} onValueChange={v => onSort(v as "title" | "price")}>
      <SelectTrigger className="w-32"><SelectValue placeholder="Sort By" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="title">Name</SelectItem>
        <SelectItem value="price">Price</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default SearchSortBar;

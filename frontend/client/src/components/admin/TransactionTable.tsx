import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Recent Transactions
        </h3>
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="donation">Donations</SelectItem>
              <SelectItem value="registration">Event Registrations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono">{transaction.id}</TableCell>
                <TableCell className="capitalize">{transaction.type}</TableCell>
                <TableCell>KES {transaction.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        transaction.status === "completed"
                          ? "bg-success/10 text-success"
                          : transaction.status === "pending"
                          ? "bg-warning/10 text-warning"
                          : "bg-error/10 text-error"
                      }`}
                  >
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {transaction.customer?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {transaction.customer?.email || 'No email provided'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

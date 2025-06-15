import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllServiceRequests } from "@/services/serviceRequestActions";
import { ServiceRequest } from "@/types/newServiceRequest";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical, Edit, Copy, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { deleteServiceRequest } from "@/services/serviceRequestActions";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { getAllUsers } from "@/services/userActions";
import { useRouter } from "next/navigation";
import { getAllEmployees } from "@/services/employeeActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignEmployeeToRequest } from "@/services/serviceRequestActions";
import { revalidatePath } from "next/cache";
import { Checkbox } from "@/components/ui/checkbox";
import { updateServiceRequest } from "@/services/serviceRequestActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DataTableProps {
  requests: ServiceRequest[];
  users: any[];
  employees: any[];
}

const DataTable: React.FC<DataTableProps> = ({ requests, users, employees }) => {
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<string | null>(null);
  const [completed, setCompleted] = React.useState(false);
  const router = useRouter();

  const handleAssignEmployee = async (requestId: string, employeeId: string) => {
    setLoading(true);
    try {
      await assignEmployeeToRequest(requestId, employeeId);
      toast({
        title: "Success",
        description: "Employee assigned successfully",
      });
      revalidatePath("/employee/EmployeeDashboard");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleCompleteRequest = async (requestId: string, completed: boolean) => {
    setLoading(true);
    try {
      await updateServiceRequest(requestId, { status: "completed" });
      toast({
        title: "Success",
        description: "Request completed successfully",
      });
      revalidatePath("/employee/EmployeeDashboard");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = React.useMemo(() => {
    let filtered = [...requests];
    if (date) {
      filtered = filtered.filter((request) => {
        const requestDate = new Date(request.createdAt);
        const selectedDate = new Date(date);
        return (
          requestDate.getFullYear() === selectedDate.getFullYear() &&
          requestDate.getMonth() === selectedDate.getMonth() &&
          requestDate.getDate() === selectedDate.getDate()
        );
      });
    }
    return filtered;
  }, [requests, date]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Service Requests</h1>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date > new Date() || date < new Date("2023-01-01")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Separator className="my-4" />
      <ScrollArea>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        request.status === "completed"
                          ? "bg-green-500"
                          : request.status === "live_tracking"
                          ? "bg-blue-500"
                          : request.status === "quote_received"
                          ? "bg-yellow-500"
                          : request.status === "revised_quote"
                          ? "bg-orange-500"
                          : request.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {users.find((user: any) => user.id === request.userId)?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {request.assignedEmployeeName || "N/A"}
                  </TableCell>
                  <TableCell>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedRequestId(request.id);
                            setOpen(true);
                          }}
                        >
                          Assign Employee <Edit className="ml-2 h-4 w-4" />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(request.id);
                            toast({
                              description: "Request ID copied to clipboard.",
                            });
                          }}
                        >
                          Copy Request ID <Copy className="ml-2 h-4 w-4" />
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem>
                              Delete Request <Trash className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the request
                                and remove its data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  setLoading(true);
                                  try {
                                    await deleteServiceRequest(request.id);
                                    toast({
                                      title: "Success",
                                      description: "Request deleted successfully",
                                    });
                                    revalidatePath("/employee/EmployeeDashboard");
                                    router.refresh();
                                  } catch (error: any) {
                                    toast({
                                      title: "Error",
                                      description: error.message,
                                      variant: "destructive",
                                    });
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign Employee</AlertDialogTitle>
            <AlertDialogDescription>Select an employee to assign to this request.</AlertDialogDescription>
          </AlertDialogHeader>
          <Select onValueChange={(value) => setSelectedEmployeeId(value)}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee: any) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!selectedEmployeeId}
              onClick={async () => {
                if (selectedRequestId && selectedEmployeeId) {
                  await handleAssignEmployee(selectedRequestId, selectedEmployeeId);
                }
              }}
            >
              Assign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const columns = [
  {
    id: "completed",
    header: ({ table }: any) => (
      <Button
        variant="outline"
        size="sm"
        className="ml-auto"
        onClick={() => table.toggleAllColumnVisibility(false)}
      >
        Hide all
      </Button>
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={row.id}
          checked={row.getValue("completed")}
          onCheckedChange={(value) => console.log(value)}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "employee",
    header: "Employee",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];

export default function EmployeeDashboard() {
  const { data: session, status } = useSession();
  const [requests, setRequests] = React.useState<ServiceRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<any[]>([]);
  const [employees, setEmployees] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
  }, [status]);

  React.useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const requests = await getAllServiceRequests();
        setRequests(requests);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const users = await getAllUsers();
        setUsers(users);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const employees = await getAllEmployees();
        setEmployees(employees);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    fetchUsers();
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Service Requests</h1>
        <Separator className="my-4" />
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-[200px]" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-3 w-[150px]" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.accessorKey || column.id}>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    session?.user ? (
      <DataTable requests={requests} users={users} employees={employees} />
    ) : null
  );
}

import { useMemo, useState } from "react";
import {
  BadgeIndianRupee,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Code2,
  Download,
  Github,
  IdCard,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { AnimatedHero } from "@/components/ui/animated-hero-section-1";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmployeeStatus = "Active" | "On Leave" | "Inactive";

type Employee = {
  id: number;
  name: string;
  role: string;
  department: string;
  salary: number;
  age: number;
  status: EmployeeStatus;
};

const initialEmployees: Employee[] = [
  {
    id: 1001,
    name: "Aarav Mehta",
    role: "Frontend Engineer",
    department: "Product",
    salary: 88000,
    age: 26,
    status: "Active",
  },
  {
    id: 1002,
    name: "Isha Rao",
    role: "HR Manager",
    department: "People",
    salary: 76000,
    age: 31,
    status: "Active",
  },
  {
    id: 1003,
    name: "Kabir Sinha",
    role: "QA Analyst",
    department: "Engineering",
    salary: 61000,
    age: 28,
    status: "On Leave",
  },
  {
    id: 1004,
    name: "Naina Kapoor",
    role: "Finance Associate",
    department: "Finance",
    salary: 69000,
    age: 29,
    status: "Active",
  },
];

const emptyEmployee: Employee = {
  id: 0,
  name: "",
  role: "",
  department: "",
  salary: 0,
  age: 18,
  status: "Active",
};

const formatSalary = (salary: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(salary);

function App() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [form, setForm] = useState<Employee>({ ...emptyEmployee, id: 1005 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const filteredEmployees = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return employees;
    return employees.filter((employee) =>
      [employee.id, employee.name, employee.role, employee.department, employee.status]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [employees, query]);

  const stats = useMemo(() => {
    const active = employees.filter((employee) => employee.status === "Active").length;
    const departments = new Set(employees.map((employee) => employee.department)).size;
    const payroll = employees.reduce((total, employee) => total + employee.salary, 0);
    return { active, departments, payroll };
  }, [employees]);

  const handleFormChange = (field: keyof Employee, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: field === "id" || field === "salary" || field === "age" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    const nextId = employees.length ? Math.max(...employees.map((employee) => employee.id)) + 1 : 1001;
    setEditingId(null);
    setForm({ ...emptyEmployee, id: nextId });
  };

  const saveEmployee = () => {
    if (!form.name.trim() || !form.role.trim() || !form.department.trim()) return;

    if (editingId) {
      setEmployees((current) => current.map((employee) => (employee.id === editingId ? form : employee)));
      resetForm();
      return;
    }

    if (employees.some((employee) => employee.id === form.id)) return;
    setEmployees((current) => [...current, form]);
    setForm({ ...emptyEmployee, id: form.id + 1 });
  };

  const editEmployee = (employee: Employee) => {
    setEditingId(employee.id);
    setForm(employee);
    document.getElementById("manager")?.scrollIntoView({ behavior: "smooth" });
  };

  const deleteEmployee = (id: number) => {
    setEmployees((current) => current.filter((employee) => employee.id !== id));
    if (editingId === id) resetForm();
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(employees, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "employees-v2.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <AnimatedHero
        backgroundImageUrl="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2400&auto=format&fit=crop"
        logo={
          <>
            <span className="grid h-10 w-10 place-items-center rounded-md border border-white/20 bg-white/10 backdrop-blur">
              <UsersRound className="h-5 w-5" />
            </span>
            <span className="font-semibold text-primary-foreground">EMS v2</span>
          </>
        }
        navLinks={[
          { label: "Dashboard", href: "#dashboard" },
          { label: "Manager", href: "#manager" },
          { label: "Features", href: "#features" },
        ]}
        topRightAction={
          <Button
            onClick={() => window.open("https://github.com/swastikjha008-jpg/employee-management.cpp", "_blank")}
            className="bg-white/10 text-primary-foreground backdrop-blur-sm border border-white/20 hover:bg-white/20"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Button>
        }
        title="Manage teams with a cleaner, faster employee system."
        description="A polished v2 inspired by your original C++ console project, rebuilt as a deploy-ready React dashboard with search, editing, payroll stats, status tracking and export."
        ctaButton={{
          text: "Open Dashboard",
          onClick: () => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" }),
        }}
        secondaryCta={{
          text: "Manage Employees",
          onClick: () => document.getElementById("manager")?.scrollIntoView({ behavior: "smooth" }),
        }}
      />

      <section id="dashboard" className="section-shell -mt-14">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={UserRoundCheck} label="Active employees" value={stats.active.toString()} tone="green" />
          <StatCard icon={Building2} label="Departments" value={stats.departments.toString()} tone="blue" />
          <StatCard icon={BadgeIndianRupee} label="Monthly payroll" value={formatSalary(stats.payroll)} tone="amber" />
        </div>
      </section>

      <section id="manager" className="section-shell grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Control Panel</p>
              <h2>{editingId ? "Update employee" : "Add employee"}</h2>
            </div>
            <span className="icon-chip">
              <Plus className="h-5 w-5" />
            </span>
          </div>

          <div className="form-grid">
            <label>
              Employee ID
              <input type="number" value={form.id} onChange={(event) => handleFormChange("id", event.target.value)} />
            </label>
            <label>
              Full name
              <input value={form.name} onChange={(event) => handleFormChange("name", event.target.value)} />
            </label>
            <label>
              Role
              <input value={form.role} onChange={(event) => handleFormChange("role", event.target.value)} />
            </label>
            <label>
              Department
              <input value={form.department} onChange={(event) => handleFormChange("department", event.target.value)} />
            </label>
            <label>
              Salary
              <input
                type="number"
                min="0"
                value={form.salary}
                onChange={(event) => handleFormChange("salary", event.target.value)}
              />
            </label>
            <label>
              Age
              <input type="number" min="18" value={form.age} onChange={(event) => handleFormChange("age", event.target.value)} />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(event) => handleFormChange("status", event.target.value)}>
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={saveEmployee}>
              <CheckCircle2 className="h-4 w-4" />
              {editingId ? "Save changes" : "Add employee"}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Clear
            </Button>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="panel-heading gap-5">
            <div>
              <p className="eyebrow">Directory</p>
              <h2>Employee records</h2>
            </div>
            <div className="toolbar">
              <div className="search-box">
                <Search className="h-4 w-4" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employees" />
              </div>
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <span className="id-pill">
                        <IdCard className="h-3.5 w-3.5" />
                        {employee.id}
                      </span>
                    </td>
                    <td>
                      <strong>{employee.name}</strong>
                      <span>{employee.role}</span>
                    </td>
                    <td>{employee.department}</td>
                    <td>{formatSalary(employee.salary)}</td>
                    <td>
                      <span className={cn("status", employee.status.toLowerCase().replace(" ", "-"))}>
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Button size="icon" variant="ghost" onClick={() => editEmployee(employee)} title="Edit employee">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteEmployee(employee.id)} title="Delete employee">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="features" className="section-shell">
        <div className="feature-band">
          <div>
            <p className="eyebrow">What changed from v1</p>
            <h2>A console idea turned into a portfolio-ready web app.</h2>
          </div>
          <div className="feature-grid">
            <Feature icon={Sparkles} title="Beautiful UI" text="Animated glass hero, responsive layout and polished dashboard surfaces." />
            <Feature icon={Search} title="Fast search" text="Filter records instantly by ID, name, role, department or status." />
            <Feature icon={BriefcaseBusiness} title="Real workflows" text="Add, edit, remove, track statuses and review payroll stats." />
            <Feature icon={Code2} title="Deploy-ready" text="Vite, React, TypeScript, Tailwind and shadcn-style components." />
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: "green" | "blue" | "amber";
}) {
  return (
    <div className="stat-card">
      <span className={cn("stat-icon", tone)}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <article className="feature">
      <Icon className="h-5 w-5" />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export default App;

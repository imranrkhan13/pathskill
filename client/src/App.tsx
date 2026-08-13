import { Toaster } from "@/components/ui/sonner";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import CourseDetail from "./pages/CourseDetail.jsx";
import Home from "./pages/Home.jsx";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/courses/:slug"} component={CourseDetail} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() { return <Router />; }

export default App;

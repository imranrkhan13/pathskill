/* Citrus Index reminder: keep the public experience editorial, warm, and visibly structured. */
import { Route, Switch } from "wouter";
import CourseDetail from "./pages/CourseDetail";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/courses/:slug" component={CourseDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

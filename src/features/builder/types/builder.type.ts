export type BuilderWidgetType =
  | "basicInfo"
  | "objective"
  | "standardIndicator"
  | "activity"
  | "mediaMaterial"
  | "assessment"
  | "homework";

export type BuilderWidget = {
  id: string;
  widgetType: BuilderWidgetType;
  orderIndex: number;
  title: string;
  contentJSON: Record<string, unknown>;
  isCollapsed: boolean;
};

export type WidgetLibraryItem = {
  widgetType: BuilderWidgetType;
  label: string;
  description: string;
};

export type SaveWidgetsRequest = {
  widgets: BuilderWidget[];
};
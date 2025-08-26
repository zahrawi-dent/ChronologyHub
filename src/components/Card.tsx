import { type JSX, splitProps } from 'solid-js';

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
  children?: JSX.Element;
}

export const Card = (props: CardProps) => {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <div
      class={`rounded-lg border bg-card text-card-foreground shadow-sm ${local.class || ''}`}
      {...others}
    >
      {local.children}
    </div>
  );
};

interface CardHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
  children?: JSX.Element;
}

export const CardHeader = (props: CardHeaderProps) => {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <div
      class={`flex flex-col space-y-1.5 p-6 ${local.class || ''}`}
      {...others}
    >
      {local.children}
    </div>
  );
};

interface CardTitleProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
  class?: string;
  children?: JSX.Element;
}

export const CardTitle = (props: CardTitleProps) => {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <h3
      class={`text-2xl font-semibold leading-none tracking-tight ${local.class || ''}`}
      {...others}
    >
      {local.children}
    </h3>
  );
};

interface CardContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
  children?: JSX.Element;
}

export const CardContent = (props: CardContentProps) => {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <div
      class={`p-6 pt-0 ${local.class || ''}`}
      {...others}
    >
      {local.children}
    </div>
  );
};

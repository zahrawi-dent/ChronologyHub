
export const Progress = (props: { value: number; class?: string }) => (
  <div class={`w-full bg-muted rounded-full ${props.class ?? ""}`}>
    <div
      class="bg-primary h-full rounded-full transition-all"
      style={{ width: `${props.value}%` }}
    />
  </div>
);

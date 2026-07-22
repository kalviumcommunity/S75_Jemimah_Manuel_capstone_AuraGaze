import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: "24px",
            color: "#fff",
            background: "#2a0f0f",
            border: "1px solid #ff6b6b",
            borderRadius: "12px",
            margin: "16px",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          <strong>Something crashed while rendering the chat:</strong>
          {"\n\n"}
          {this.state.error?.message || String(this.state.error)}
        </div>
      );
    }

    return this.props.children;
  }
}
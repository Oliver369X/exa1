import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      border: string;
      text: string;
      textSecondary: string;
      success: string;
      warning: string;
      error: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
  }
}
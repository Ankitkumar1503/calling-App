import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ViewProps } from 'react-native';

interface Props extends ViewProps {
  children: ReactNode;
  className?: string;
}

export default function GradientBackground({ children, className, ...props }: Props) {
  return (
    <LinearGradient
      colors={['#0F2027', '#203A43', '#2C5364']}
      className={`flex-1 ${className}`}
      {...props}
    >
      {children}
    </LinearGradient>
  );
}

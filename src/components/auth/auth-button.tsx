import { Button, ButtonText } from '@/components/ui/button';
import React from 'react';

type AuthButtonProps = React.ComponentProps<typeof Button> & {
  buttonText: string;
};

function AuthButton({ buttonText, ...buttonProps }: AuthButtonProps) {
  return (
    <Button {...buttonProps}>
      <ButtonText>{buttonText}</ButtonText>
    </Button>
  );
}

export default AuthButton;

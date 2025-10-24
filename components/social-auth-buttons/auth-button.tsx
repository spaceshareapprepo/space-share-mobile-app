import React from 'react';
import { Button, ButtonText } from '@/components/ui/button';

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

import { CardWrapper } from "@/components/auth/card-wrapper"

export const LoginForm = () => {
    return (
        <CardWrapper
            headerTitle="Login"
            headerLabel="Welcome back!"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            Login Form
        </CardWrapper>
    )
}
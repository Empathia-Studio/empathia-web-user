export default interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    displayName: string;
    isEmailVerified: boolean;
    passwordHash: string;
}
import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonProps {
    children: ReactNode;
    isLoading: boolean;
    fullWidth?: boolean;
}

const SkeletonWrapper = ({ children, isLoading, fullWidth = true }: SkeletonProps) => {

    if (!isLoading) return children;

    return (
        <Skeleton className={
            cn(fullWidth && "w-full")
        }>
            <div className="opacity-0">{children}</div>
        </Skeleton>
    );
}

export default SkeletonWrapper;
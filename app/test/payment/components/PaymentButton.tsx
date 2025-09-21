'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  isLoading: boolean;
}

export default function PaymentButton({ isLoading }: PaymentButtonProps) {
  return (
    <div className="pt-6 border-t">
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            결제 처리 중...
          </>
        ) : (
          '결제 요청'
        )}
      </Button>
      
      <p className="mt-2 text-xs text-gray-500 text-center">
        결제 요청 버튼을 클릭하면 KCP 결제창이 열립니다.
      </p>
    </div>
  );
}

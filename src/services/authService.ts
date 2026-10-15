import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut, 
  onAuthStateChanged,
  type User,
  type Unsubscribe,
  type NextOrObserver
} from "firebase/auth";
import { auth } from "../lib/firebase";

export { auth };

export const provider = new GoogleAuthProvider();
provider.addScope("email");
provider.addScope("profile");

// 로그인 창 뜰 때 항상 계정 선택 유도
provider.setCustomParameters({
  prompt: "select_account"
});

/**
 * Google 로그인 실행 (PC/모바일 하이브리드)
 * 팝업을 우선 시도하며 차단/모바일 환경 감지 시 리디렉션 방식으로 자동 전환
 */
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    const code = error?.code || "";
    // 모바일 등 팝업이 차단되거나 취소된 환경인 경우 리디렉션 방식으로 자동 전환
    if (
      code === "auth/popup-blocked" || 
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request" ||
      (typeof navigator !== "undefined" && /iphone|ipad|ipod|android/i.test(navigator.userAgent))
    ) {
      console.warn("팝업 차단 감지 또는 모바일 환경: 리디렉션 방식으로 전환합니다.");
      await signInWithRedirect(auth, provider);
      return null;
    } else {
      console.error("Google 로그인 실패:", error);
      throw error;
    }
  }
}

/**
 * 모바일 리디렉션 로그인 후 페이지 복귀 시 결과 처리
 */
export async function handleRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
  } catch (error) {
    console.error("리디렉션 로그인 결과 처리 중 오류:", error);
  }
  return null;
}

/**
 * 로그아웃 실행
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw error;
  }
}

/**
 * 사용자 로그인 상태 변경 감지
 */
export function watchAuthState(callback: NextOrObserver<User>): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export default {
  auth,
  provider,
  loginWithGoogle,
  handleRedirectResult,
  logoutUser,
  watchAuthState,
};

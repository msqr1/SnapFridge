import { createClient } from "@utils/supabase/server";
import LoginButtons from "@components/login/LoginButtons";
import { redirect } from "next/navigation";
import { PageMargin } from "@components/Global";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user !== null) {
    redirect("/dashboard");
  }

  return (
    <PageMargin>
      <LoginButtons />
    </PageMargin>
  );
}

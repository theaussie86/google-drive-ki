import ButtonSignin from "@/components/ButtonSignin";

export default function Page() {
  return (
    <main>
      <section className="flex flex-col items-center justify-center text-center gap-12 px-8 py-24">
        <h1 className="text-3xl font-extrabold">My Docs GPT</h1>

        <p className="text-lg opacity-80">
          Möchtest du KI nutzen, um mit deinen Dokumenten zu chatten? Dann bist
          du hier genau richtig!
        </p>

        <ButtonSignin
          text="Jetzt starten"
          extraStyle="bg-primary hover:bg-primary/90 text-white"
        />
      </section>
    </main>
  );
}

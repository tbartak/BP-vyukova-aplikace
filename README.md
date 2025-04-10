# Návod k instalaci

## Přemístit se do složky vyukova-aplikace

```bash
cd vyukova-aplikace
```

## Instalace všech požadovaných závislostí

```bash
npm install
```

Tento příkaz zajistí, že se nainstalují všechny balíčky, které jsou definované v `package.json`, včetně:

- React a React DOM (19.0.0)
- React Router (7.2.0)
- Material UI (6.4.6)
- D3.js (7.9.0)
- a dalších balíčků včetně nástrojů pro vývoj:
  - TypeScript (5.7.2)
  - ESLint (9.21.0)
  - Vite (6.2.0)
  - ...

## Lokální spuštění aplikace na vývojovém serveru

```bash
npm run dev
```

Tento příkaz zpřístupní aplikaci na lokálním počítači prostřednictvím odkazu.

## Vytvoření verze pro produkci

```bash
npm run build
```

## Lokální kontrola produkční verze

```bash
npm run preview
```

# Nasazení na web

Aplikace je vystavena na webovém hostingu Vercel, na adrese: [https://bp-vyukova-aplikace.vercel.app](https://bp-vyukova-aplikace.vercel.app). Tento hosting byl zvolen pro jednoduché nasazení a propojení s Git repositářem, díky čemuž je možné aplikaci průběžně, velmi jednoduše aktualizovat s novými změnami v repositáři.
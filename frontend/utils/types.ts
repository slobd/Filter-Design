export type NameType = {
  firstName: string;
  lastName: string;
}

export type OptionType = {
  value: string;
  label: string;
}

export type SignupType = {
  email: string,
  password: string
}

export type ProfileType = {
  name: NameType,
  email: string,
  country: OptionType | undefined,
  state: OptionType | undefined,
  city: OptionType | undefined,
  postalCode: string | "",
  address: string | "",
  phone: string | "",
  bio: string | "",
}

export type ReceiptType = {
  id: number | null,
  user_id: string | "",
  from: string | "",
  logo: string | ""
  name: string | "",
  address: string | "",
  link: string | "",
  date: string | "",
  time: string | "",
  currency: string | "",
  amount: number | "",
}

export type EmailType = {
  id: number | null,
  user_id: number | null,
  email: string | ""
}


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react"


interface RegisterFormProps {
  onClose: () => void;
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
  const [loginContactEmail, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [contactPhonenumber, setContactPhonenumber] = useState("")
  const [role, setRole] = useState<boolean | null>(null)
  const [error, setError] = useState("")

  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [addressError, setAddressError] = useState("")
  const [cityError, setCityError] = useState("")
  const [postalCodeError, setPostalCodeError] = useState("")
  const [roleError, setRoleError] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Name ist erforderlich")
      return false
    }
    if (value.length < 2) {
      setNameError("Name muss mindestens 2 Zeichen lang sein")
      return false
    }
    setNameError("")
    return true
  }

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value.trim()) {
      setEmailError("E-Mail ist erforderlich")
      return false
    }
    if (!emailRegex.test(value)) {
      setEmailError("Ungültige E-Mail-Adresse")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePhone = (value: string) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    if (!value.trim()) {
      setPhoneError("Telefonnummer ist erforderlich")
      return false
    }
    if (!phoneRegex.test(value)) {
      setPhoneError("Ungültige Telefonnummer")
      return false
    }
    setPhoneError("")
    return true
  }

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Passwort ist erforderlich")
      return false
    }
    if (value.length < 8) {
      setPasswordError("Passwort muss mindestens 8 Zeichen lang sein")
      return false
    }
    setPasswordError("")
    return true
  }

  const validateConfirmPassword = (value: string) => {
    if (value !== password) {
      setConfirmPasswordError("Passwörter stimmen nicht überein")
      return false
    }
    setConfirmPasswordError("")
    return true
  }

  const validateAddress = (value: string) => {
    if (!value.trim()) {
      setAddressError("Adresse ist erforderlich")
      return false
    }
    setAddressError("")
    return true
  }

  const validateCity = (value: string) => {
    if (!value.trim()) {
      setCityError("Stadt ist erforderlich")
      return false
    }
    setCityError("")
    return true
  }

  const validatePostalCode = (value: string) => {
    const postalCodeRegex = /^\d{5}$/
    if (!value.trim()) {
      setPostalCodeError("Postleitzahl ist erforderlich")
      return false
    }
    if (!postalCodeRegex.test(value)) {
      setPostalCodeError("Ungültige Postleitzahl (5 Ziffern erforderlich)")
      return false
    }
    setPostalCodeError("")
    return true
  }

  const validateRole = (value: boolean | null) => {
    if (value === null) {
      setRoleError("Bitte wählen Sie eine Rolle aus")
      return false
    }
    setRoleError("")
    return true
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    // Inputs validieren
    const isNameValid = validateName(name)
    const isEmailValid = validateEmail(loginContactEmail)
    const isPhoneValid = validatePhone(contactPhonenumber)
    const isPasswordValid = validatePassword(password)
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword)
    const isAddressValid = validateAddress(address)
    const isCityValid = validateCity(city)
    const isPostalCodeValid = validatePostalCode(postalCode)
    const isRoleValid = validateRole(role)

    if (
      !isNameValid ||
      !isEmailValid ||
      !isPhoneValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid ||
      !isAddressValid ||
      !isCityValid ||
      !isPostalCodeValid ||
      !isRoleValid
    ) {
      return
    }

    try {
      const res = await fetch("http://localhost:8050/account/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginContactEmail,
          password,
          address,
          city,
          postalCode,
          name,
          role,
          contactPhonenumber,
        }),
      })

      if (!res.ok) {
        setError("Die Email-Adresse ist bereits vergeben.")
        return
      }

      alert("Registrierung erfolgreich. Sie können sich jetzt anmelden.")
      onClose()
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten: " + err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap -mx-4">
        {/* Left Column */}
        <div className="w-full lg:w-1/2 px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                validateName(e.target.value)
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400"
            />
            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={loginContactEmail}
              onChange={(e) => {
                setEmail(e.target.value)
                validateEmail(e.target.value)
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400"
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhonenumber">Kontakt Telefonnummer</Label>
            <Input
              id="contactPhonenumber"
              type="tel"
              value={contactPhonenumber}
              onChange={(e) => {
                setContactPhonenumber(e.target.value)
                validatePhone(e.target.value)
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400"
            />
            {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
          </div>
          <div className="space-y-2 relative">
            <Label htmlFor="password">Passwort</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  validatePassword(e.target.value)
                }}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>

          <div className="space-y-2 relative mt-4">
            <Label htmlFor="confirmPassword">Passwort Wiederholen</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  validateConfirmPassword(e.target.value)
                }}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/2 px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                validateAddress(e.target.value)
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400"
            />
            {addressError && <p className="text-red-500 text-sm">{addressError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Stadt</Label>
            <Input
              id="city"
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
                validateCity(e.target.value)
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400"
            />
            {cityError && <p className="text-red-500 text-sm">{cityError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postleitzahl</Label>
            <Input
              id="postalCode"
              type="text"
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value)
                validatePostalCode(e.target.value)
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400"
            />
            {postalCodeError && <p className="text-red-500 text-sm">{postalCodeError}</p>}
          </div>
          <div className="space-y-2">
            <Label>Rolle</Label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="Anbieter"
                  checked={role === true}
                  onChange={() => {
                    setRole(true)
                    validateRole(true)
                  }}
                  className="peer appearance-none rounded-full w-5 h-5 border-2 border-green-500 checked:bg-green-500 hover:bg-green-500 focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
                <span>Anbieter</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="Abnehmer"
                  checked={role === false}
                  onChange={() => {
                    setRole(false)
                    validateRole(false)
                  }}
                  className="peer appearance-none rounded-full w-5 h-5 border-2 border-green-500 checked:bg-green-500 hover:bg-green-500 focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
                <span>Abnehmer</span>
              </label>
            </div>
            {roleError && <p className="text-red-500 text-sm">{roleError}</p>}
          </div>
        </div>
      </div>
      <div className="space-y-2">{error && <p className="text-red-500 text-sm">{error}</p>}</div>
      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white mt-4">
        Registrieren
      </Button>
    </form>
  )
}

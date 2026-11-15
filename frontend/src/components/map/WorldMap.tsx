"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
// import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Country {
  slug: string;
  name: string;
  flag: string;
  currency: string;
  listings: string;
  tagline: string;
  description: string;
  cities: string[];
  popularCategories: string[];
}

interface WorldMapProps {
  countries: Country[];
}

export default function WorldMap({ countries }: WorldMapProps) {
  const [selectedCountry, setSelectedCountry] =
    useState<Country | null>(null);

  // const router = useRouter();

  const pathname = usePathname();

  const activeSlug = pathname.startsWith("/ads-in-")? pathname.replace("/ads-in-", "") : null;

  // Create a lookup using country names
  const countryMap = new Map(
    countries.map((country) => [
      country.name.toLowerCase(),
      country,
    ])
  );

  return (
    <div className="w-full">
      <div className="rounded-2xl">
        {activeSlug && <p className="mb-5 text-xl text-center text-accent">
          Select a country to explore its marketplace.
        </p>}

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 110,
          }}
          width={800}
          height={300}
          style={{
            width: "100%",
            height: "auto",
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName =
                  geo.properties.name?.toLowerCase();

                const country = countryMap.get(countryName);
                const isSelected = country?.slug === activeSlug;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (country) {
                        // router.push(`/ads-in-${country.slug}`);
                        setSelectedCountry(country);
                      }
                    }}
                    style={{
                      fill: country
                        ? isSelected
                          ? "#013941"
                          : "#80C9B7"
                        : "#E5E7EB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.7,
                      outline: "none",
                      cursor: country ? "pointer" : "default",
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Selected country information */}
        {selectedCountry && (
          <div className="my-5 rounded-xl bg-gray-50 dark:bg-[#1b303b] p-5 ">
            <div className="flex gap-3 items-center mx-auto mb-3 max-w-5xl">
              <span className="text-3xl">
                {selectedCountry.flag}
              </span>

              <div>
                <h3 className="text-lg font-bold">
                  {selectedCountry.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedCountry.tagline}
                </p>
              </div>
            </div>

            <p className="mx-auto mb-3 max-w-5xl text-sm">
              {selectedCountry.description}
            </p>

            
            <div className="mx-auto mt-4 max-w-5xl">
              <p className="mb-2 text-sm font-semibold">
                Popular cities
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCountry.cities.map((city) => (
                  <span
                    key={city}
                    className="text-xs rounded-full bg-white dark:bg-[#263e49] px-3 py-2"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
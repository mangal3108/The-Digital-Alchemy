import { ImageResponse } from "next/og";
import { publicAssetDataUri } from "@/lib/brand-asset";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon — the brand mark only. No text: at 32 pixels a wordmark is noise,
 * and the mark alone is what people recognise in a crowded tab strip.
 *
 * Kept on the dark rounded tile because the mark's own blues are mid-tone and
 * would dissolve into a light browser chrome.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0d",
          borderRadius: 7,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={publicAssetDataUri("brand/logo-mark.png")}
          width={25}
          height={20}
          alt=""
        />
      </div>
    ),
    size,
  );
}

/**
 * Feature switches.
 *
 * Each switch defaults to OFF and is turned on with an environment variable, so
 * nothing gated here can reach the live site by accident.
 *
 * They are read when a page renders — and the pages that use them are static,
 * which means that happens at BUILD time. Changing a switch needs a rebuild.
 */
export const features = {
  /**
   * The six hardcoded testimonials in `sections/testimonials.tsx` — Elena
   * Rostova, Marcus Vance, Devon Miller, Priya Sundaram, Kenji Sato and Sarah
   * Lin — together with the figures around them (4.9 / 5.0, "Tech Debt Left
   * 0.0%", $42,000, 82K concurrent, +34%) and the "REAL FOUNDER STORIES" and
   * "100% PRODUCTION VERIFIED" badges.
   *
   * None of these people or companies is in the database, none was entered
   * through the admin, and none has been confirmed as a client. Several of the
   * company names match ones already removed from the chatbot as invented.
   * Showing them as real would mislead visitors and breaches Google's review
   * policies, so they stay hidden until each one is verified.
   *
   * The code is kept, not deleted, so a confirmed testimonial can be restored.
   * Real testimonials belong in the admin (Testimonials), which is what the
   * section shows while this is off.
   *
   * Turn on only for a local preview: set TDA_SHOW_UNVERIFIED_TESTIMONIALS=1
   * and rebuild.
   */
  unverifiedTestimonials: process.env.TDA_SHOW_UNVERIFIED_TESTIMONIALS === "1",
} as const;

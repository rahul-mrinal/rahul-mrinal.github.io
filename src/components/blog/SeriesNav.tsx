import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import type { BlogPostMeta } from "../../data/blogPosts";
import { getSeriesById } from "../../data/series";

interface SeriesNavProps {
  current: BlogPostMeta;
  prev: BlogPostMeta | null;
  next: BlogPostMeta | null;
  totalInSeries: number;
}

export default function SeriesNav({ current, prev, next, totalInSeries }: SeriesNavProps) {
  const series = getSeriesById(current.series);

  return (
    <div className="mt-16 pt-8 border-t border-border">
      {series && (
        <div className="text-center mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
            Part {current.seriesOrder} of {totalInSeries} in{" "}
            <span style={{ color: series.color }}>{series.title}</span>
          </span>
          <div className="flex justify-center mt-2 gap-1">
            {Array.from({ length: totalInSeries }).map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all"
                style={{
                  width: i + 1 === current.seriesOrder ? "24px" : "8px",
                  backgroundColor:
                    i + 1 <= current.seriesOrder ? series.color : "#2a2d3a",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {prev ? (
          <Link
            to={`/blog/${prev.series}/${prev.slug}`}
            className="glass-card rounded-xl p-5 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
              <FiArrowLeft size={12} />
              Previous
            </div>
            <span className="text-white text-sm font-medium group-hover:text-accent transition-colors">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to={`/blog/${next.series}/${next.slug}`}
            className="glass-card rounded-xl p-5 hover:border-white/20 transition-all group text-right"
          >
            <div className="flex items-center justify-end gap-2 text-xs text-text-secondary mb-2">
              Next
              <FiArrowRight size={12} />
            </div>
            <span className="text-white text-sm font-medium group-hover:text-accent transition-colors">
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

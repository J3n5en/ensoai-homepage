import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, GitBranch, GitMerge, Layers, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function Features() {
	const { t } = useTranslation();
	const [activeFeature, setActiveFeature] = useState(0);

	const features = [
		{
			icon: <Brain className="w-5 h-5" />,
			title: t("features.items.aiNative.title"),
			description: t("features.items.aiNative.desc"),
			image: "/feature-terminal.png",
			color: "text-ayu-accent",
		},
		{
			icon: <GitBranch className="w-5 h-5" />,
			title: t("features.items.blazingFast.title"),
			description: t("features.items.blazingFast.desc"),
			image: "/feature-editor.png",
			color: "text-ayu-string",
		},
		{
			icon: <Zap className="w-5 h-5" />,
			title: t("features.items.beautifulThemes.title"),
			description: t("features.items.beautifulThemes.desc"),
			image: "/feature-git.png",
			color: "text-ayu-func",
		},
		{
			icon: <Layers className="w-5 h-5" />,
			title: t("features.items.visualGit.title"),
			description: t("features.items.visualGit.desc"),
			image: "/feature-agents.png",
			color: "text-ayu-regexp",
		},
		{
			icon: <GitMerge className="w-5 h-5" />,
			title: t("features.items.mergeTool.title"),
			description: t("features.items.mergeTool.desc"),
			image: "/feature-merge.png",
			color: "text-ayu-constant",
		},
	];

	// Optional: Auto-rotate features if not interacted with
	useEffect(() => {
		const timer = setInterval(() => {
			setActiveFeature((prev) => (prev + 1) % features.length);
		}, 5000);
		return () => clearInterval(timer);
	}, [features.length]);

	return (
		<section
			id="features"
			className="pt-24 pb-12 bg-ayu-bg relative border-t border-ayu-line"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-20 text-center">
					<h2 className="text-4xl md:text-5xl font-bold text-ayu-fg mb-6 tracking-tight">
						{t("features.title")}
					</h2>
					<p className="text-xl text-ayu-fg/60 max-w-2xl mx-auto leading-relaxed font-light">
						{t("features.subtitle")}
					</p>
				</div>

				<div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
					{/* Left Side: Feature List */}
					<div className="w-full lg:w-1/3 flex flex-col gap-4">
						{features.map((feature, index) => (
							<button
								key={index}
								onClick={() => setActiveFeature(index)}
								className={clsx(
									"text-left p-6 rounded-2xl transition-all duration-300 border group relative overflow-hidden",
									activeFeature === index
										? "bg-white border-ayu-line shadow-lg scale-[1.02]"
										: "bg-transparent border-transparent hover:bg-white/50 hover:border-ayu-line/50 opacity-60 hover:opacity-100",
								)}
							>
								{activeFeature === index && (
									<motion.div
										layoutId="active-glow"
										className="absolute inset-0 bg-gradient-to-r from-ayu-accent/5 to-transparent opacity-50"
									/>
								)}
								<div className="relative z-10">
									<div className="flex items-center gap-3 mb-2">
										<div
											className={clsx(
												"p-2 rounded-lg transition-colors",
												activeFeature === index
													? "bg-ayu-bg shadow-sm"
													: "bg-transparent",
											)}
										>
											<div className={feature.color}>{feature.icon}</div>
										</div>
										<h3
											className={clsx(
												"text-xl font-bold transition-colors",
												activeFeature === index
													? "text-ayu-fg"
													: "text-ayu-fg/80",
											)}
										>
											{feature.title}
										</h3>
									</div>
									<p className="text-sm text-ayu-fg/60 leading-relaxed pl-12">
										{feature.description}
									</p>
								</div>
							</button>
						))}
					</div>

					{/* Right Side: Image Preview */}
					<div className="w-full lg:w-2/3 lg:sticky lg:top-24 h-fit">
						<div className="relative rounded-3xl border border-ayu-line bg-white shadow-2xl overflow-hidden perspective-1000">
							<div className="absolute inset-0 bg-ayu-bg/50"></div>

							{/* Window Controls Decoration */}
							<div className="relative h-10 bg-white border-b border-ayu-line z-20 flex items-center px-4 gap-2">
								<div className="w-3 h-3 rounded-full bg-red-400"></div>
								<div className="w-3 h-3 rounded-full bg-yellow-400"></div>
								<div className="w-3 h-3 rounded-full bg-green-400"></div>
							</div>

							<div className="relative bg-ayu-bg/10 flex items-start justify-center">
								<AnimatePresence mode="wait">
									<motion.img
										key={activeFeature}
										src={features[activeFeature].image}
										alt={features[activeFeature].title}
										initial={{ opacity: 0, y: 10, scale: 0.99 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, position: "absolute", zIndex: -1 }} // Absolute exit to prevent layout jump
										transition={{ duration: 0.3, ease: "easeOut" }}
										className="w-full h-auto object-top rounded-b-xl border border-ayu-line/30 shadow-sm relative z-10"
									/>
								</AnimatePresence>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

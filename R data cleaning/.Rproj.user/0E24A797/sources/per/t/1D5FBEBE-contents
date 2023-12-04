library('tidyverse')
library('dplyr')

all_food_price <- read.csv('data_price.csv')

# Use dplyr to aggregate by summing the "Value" column for each year
aggregated_data <- all_food_price %>%
  group_by(Series.ID, Year) %>%
  summarize(average_price = round(mean(Value), 2))


# Print the aggregated data
print(aggregated_data)

reshaped_data <- aggregated_data %>%
  pivot_wider(
    names_from = Series.ID,
    values_from = average_price)

# Convert NA to NULL
reshaped_data[is.na(reshaped_data)] <- NULL

# Print the reshaped data
print(reshaped_data)

write.csv(reshaped_data,file='/Users/emmanguyen/Desktop/lame stuff/Fall23/Vis Tech/p5.j2 sketch/R data cleaning/clean_data.csv',fileEncoding = "UTF-8")

#Transpose the reshaped data to have years as columns
transposed_df_reshaped <- t(reshaped_data)
transposed_df_reshaped
write.csv(transposed_df_reshaped,file='/Users/emmanguyen/Desktop/lame stuff/Fall23/Vis Tech/p5.j2 sketch/R data cleaning/transposed_df_reshaped.csv',fileEncoding = "UTF-8")

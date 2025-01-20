import xml.etree.ElementTree as ET

def replace_colors(svg_file, color_map):
    # 解析SVG文件
    tree = ET.parse(svg_file)
    root = tree.getroot()

    # 遍历SVG的所有元素
    for elem in root.iter():
        # 检查元素的颜色属性，并进行替换
        for attribute in elem.attrib:
            if elem.attrib[attribute] in color_map:
                elem.attrib[attribute] = color_map[elem.attrib[attribute]]
    
    # 保存修改后的SVG文件
    tree.write('modified_' + svg_file)

if __name__ == "__main__":
    # 定义颜色映射
    color_mapping = {
        '#0c0426': '#3f3d56',
        '#8c71ff': '#845ec2'
    }

    # 指定SVG文件名
    svg_file_name = 'banner.svg'

    # 调用函数进行颜色替换
    replace_colors(svg_file_name, color_mapping)

    print(f"SVG文件中的颜色已替换并保存为 modified_{svg_file_name}")